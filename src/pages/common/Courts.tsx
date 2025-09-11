import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
import { fetchCourts } from '../../store/thunks/courtsThunks'
import { LoadingSpinner } from '../../components/common'
import {
  CourtsHero,
  CourtsStatistics,
  CourtsFilter,
  CourtsListing,
  CourtsFeatures,
  CourtsCTA
} from '../../components/common/Courts'

const CourtsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: commonData, isLoading: commonLoading } = useSelector((state: RootState) => state.common)
  const { courts, isLoading: courtsLoading, totalCount } = useSelector((state: RootState) => state.courts)
  const [selectedState, setSelectedState] = useState<string>('')

  useEffect(() => {
    document.title = 'Courts - Mexican Pickleball Federation'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find and reserve pickleball courts across Mexico. Browse courts by state, view amenities, and book your next game at top-rated facilities.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Find and reserve pickleball courts across Mexico. Browse courts by state, view amenities, and book your next game at top-rated facilities.'
      document.head.appendChild(meta)
    }

    if (!commonData) {
      dispatch(fetchCommonData())
    }
    
    dispatch(fetchCourts(selectedState ? { state_id: parseInt(selectedState) } : {}))
  }, [dispatch, commonData, selectedState])

  const handleStateFilter = (stateId: string) => {
    setSelectedState(stateId)
  }

  if (commonLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading courts..." />
      </div>
    )
  }

  const states = commonData?.states || []

  return (
    <>
      <CourtsHero />
      
      {commonData?.federation_statistics && (
        <CourtsStatistics statistics={commonData.federation_statistics} />
      )}
      
      <CourtsFilter 
        states={states}
        selectedState={selectedState}
        onStateFilter={handleStateFilter}
      />
      
      <CourtsListing 
        courts={courts}
        isLoading={courtsLoading}
        totalCount={totalCount}
      />
      <CourtsFeatures />
      <CourtsCTA />
    </>
  )
}

export default CourtsPage