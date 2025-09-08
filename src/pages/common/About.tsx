import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from '../../components/layout'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
import {
  AboutHero,
  FederationStatistics,
  FederationFunctions,
  OrganizationStructure,
  TournamentOrganization,
  DigitalCredentials,
  AboutCTA
} from '../../components/common/About'

const AboutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: commonData } = useSelector((state: RootState) => state.common)

  useEffect(() => {
    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  return (
    <Layout>
      <AboutHero />
      
      {commonData?.federation_statistics && (
        <FederationStatistics statistics={commonData.federation_statistics} />
      )}
      
      <FederationFunctions />
      <OrganizationStructure />
      <TournamentOrganization />
      <DigitalCredentials />
      <AboutCTA />
    </Layout>
  )
}

export default AboutPage