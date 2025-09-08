import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '../../components/layout'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
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
  const { data: commonData, isLoading } = useSelector((state: RootState) => state.common)
  const [selectedState, setSelectedState] = useState<string>('')

  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  const handleStateFilter = (stateId: string) => {
    setSelectedState(stateId)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" message="Loading courts..." />
        </div>
      </Layout>
    )
  }

  const states = commonData?.states || []

  return (
    <Layout>
      <CourtsHero />
      
      {commonData?.federation_statistics && (
        <CourtsStatistics statistics={commonData.federation_statistics} />
      )}
      
      <CourtsFilter 
        states={states}
        selectedState={selectedState}
        onStateFilter={handleStateFilter}
      />
      
      <CourtsListing />
      <CourtsFeatures />
      <CourtsCTA />
    </Layout>
  )
}

export default CourtsPage