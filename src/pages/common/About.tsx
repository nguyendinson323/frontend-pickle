import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { fetchCommonData } from '../../store/slices/commonSlice'
import {
  AboutHero,
  FederationStatistics,
  FederationFunctions,
  OrganizationStructure,
  TournamentOrganization,
  DigitalCredentials,
  FederationInfo,
  FeaturedContent,
  NewsSection,
  AboutCTA
} from '../../components/common/About'

const AboutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: commonData } = useSelector((state: RootState) => state.common)

  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = 'About - Mexican Pickleball Federation'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about the Mexican Pickleball Federation - the official governing body for pickleball development and regulation in Mexico, dedicated to promoting the sport nationwide.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Learn about the Mexican Pickleball Federation - the official governing body for pickleball development and regulation in Mexico, dedicated to promoting the sport nationwide.'
      document.head.appendChild(meta)
    }

    if (!commonData) {
      dispatch(fetchCommonData())
    }
  }, [dispatch, commonData])

  return (
    <>
      <AboutHero />
      
      {commonData?.federation_statistics && (
        <FederationStatistics statistics={commonData.federation_statistics} />
      )}
      
      <FederationFunctions />
      <OrganizationStructure />
      <TournamentOrganization />
      <DigitalCredentials />
      
      {commonData?.federation_info && (
        <FederationInfo info={commonData.federation_info} />
      )}
      
      {commonData?.featured_content && (
        <FeaturedContent content={commonData.featured_content} />
      )}
      
      {commonData?.news_articles && (
        <NewsSection articles={commonData.news_articles} />
      )}
      
      <AboutCTA />
    </>
  )
}

export default AboutPage