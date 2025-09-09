import React from 'react'
import { TournamentMatch } from '../../types/tournaments'

interface TournamentBracketProps {
  matches: TournamentMatch[]
  onMatchUpdate?: (matchId: number, updates: { score: string; winner_side: 1 | 2; status: 'completed' }) => void
}

interface MatchGroup {
  round: number
  matches: TournamentMatch[]
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ matches, onMatchUpdate }) => {
  const groupMatchesByRound = (): MatchGroup[] => {
    const groups: { [key: number]: TournamentMatch[] } = {}
    
    matches.forEach(match => {
      if (!groups[match.round]) {
        groups[match.round] = []
      }
      groups[match.round].push(match)
    })
    
    return Object.keys(groups)
      .map(round => ({
        round: parseInt(round),
        matches: groups[parseInt(round)].sort((a, b) => a.match_number - b.match_number)
      }))
      .sort((a, b) => a.round - b.round)
  }

  const getRoundName = (round: number, totalRounds: number): string => {
    const roundsFromEnd = totalRounds - round + 1
    if (roundsFromEnd === 1) return 'Final'
    if (roundsFromEnd === 2) return 'Semi-Final'
    if (roundsFromEnd === 3) return 'Quarter-Final'
    return `Round ${round}`
  }

  const getPlayerName = (match: TournamentMatch, side: 1 | 2): string => {
    if (side === 1) {
      const name1 = match.player1?.full_name || 'TBD'
      const name2 = match.player2?.full_name
      return name2 ? `${name1} / ${name2}` : name1
    } else {
      const name3 = match.player3?.full_name || 'TBD'
      const name4 = match.player4?.full_name
      return name4 ? `${name3} / ${name4}` : name3
    }
  }

  const handleScoreUpdate = (match: TournamentMatch, score: string, winnerSide: 1 | 2) => {
    if (onMatchUpdate) {
      onMatchUpdate(match.id, {
        score,
        winner_side: winnerSide,
        status: 'completed'
      })
    }
  }

  const matchGroups = groupMatchesByRound()
  const totalRounds = matchGroups.length

  if (matches.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No bracket generated yet</p>
      </div>
    )
  }

  return (
    <div className="tournament-bracket overflow-x-auto">
      <div className="flex space-x-8 min-w-max p-4">
        {matchGroups.map(group => (
          <div key={group.round} className="flex-shrink-0">
            <h3 className="text-lg font-semibold text-center mb-4 text-gray-800">
              {getRoundName(group.round, totalRounds)}
            </h3>
            <div className="space-y-6">
              {group.matches.map(match => (
                <div
                  key={match.id}
                  className={`bg-white border-2 rounded-lg p-4 w-64 shadow-sm ${
                    match.status === 'completed' ? 'border-green-500' : 
                    match.status === 'in_progress' ? 'border-blue-500' : 
                    'border-gray-300'
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-2">
                    Match #{match.match_number}
                    {match.court?.name && (
                      <span className="ml-2">• {match.court.name}</span>
                    )}
                  </div>
                  
                  {match.match_date && (
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(match.match_date).toLocaleDateString()}
                      {match.match_time && (
                        <span className="ml-2">{match.match_time}</span>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div 
                      className={`p-2 rounded border ${
                        match.winner_side === 1 ? 'bg-green-100 border-green-300 font-semibold' : 
                        ' border-gray-200'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {getPlayerName(match, 1)}
                      </div>
                    </div>

                    <div className="text-center text-xs text-gray-400">vs</div>

                    <div 
                      className={`p-2 rounded border ${
                        match.winner_side === 2 ? 'bg-green-100 border-green-300 font-semibold' : 
                        ' border-gray-200'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {getPlayerName(match, 2)}
                      </div>
                    </div>
                  </div>

                  {match.score && (
                    <div className="mt-3 text-center">
                      <div className="text-sm font-semibold text-gray-700 bg-gray-100 rounded px-2 py-1">
                        {match.score}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      match.status === 'completed' ? 'bg-green-100 text-green-800' :
                      match.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      match.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status === 'scheduled' ? 'Scheduled' :
                       match.status === 'in_progress' ? 'In Progress' :
                       match.status === 'completed' ? 'Completed' :
                       match.status === 'walkover' ? 'Walkover' :
                       'Canceled'}
                    </span>
                  </div>

                  {match.status === 'in_progress' && onMatchUpdate && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Score (e.g., 6-4, 6-2)"
                        className="w-full text-xs p-2 border border-gray-300 rounded"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const score = (e.target as HTMLInputElement).value
                            if (score) {
                              const winnerSide = Math.random() > 0.5 ? 1 : 2
                              handleScoreUpdate(match, score, winnerSide)
                            }
                          }
                        }}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const input = document.querySelector(`input[placeholder*="Score"]`) as HTMLInputElement
                            const score = input?.value || '6-4, 6-2'
                            handleScoreUpdate(match, score, 1)
                          }}
                          className="flex-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Side 1 Wins
                        </button>
                        <button
                          onClick={() => {
                            const input = document.querySelector(`input[placeholder*="Score"]`) as HTMLInputElement
                            const score = input?.value || '6-4, 6-2'
                            handleScoreUpdate(match, score, 2)
                          }}
                          className="flex-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Side 2 Wins
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TournamentBracket