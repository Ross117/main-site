import React from "react"
import { graphql } from "gatsby"

// components
import Layout from "../components/Layout/"
import SEO from "../components/SEO/"

import Hero from "../components/Hero"
import NextMeetup from "../components/NextMeetup"
import Organisers from "../components/Organisers"
import Flex from "../components/Flex"
import Grid from "../components/Grid"
import Location from "../components/Location"
import SocialPanel from "../components/SocialPanel"
import UpcomingMeetups from "../components/UpcomingMeetups"
import LearningResources from "../components/LearningResources"
import Blogposts from "../components/Blogposts"
import Contributing from "../components/Contributing"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <Hero />
    <NextMeetup />
    <Organisers />
    <Flex>
      <Location />
      <SocialPanel />
    </Flex>
    <Flex>
      <Grid
        style={{
          gridTemplateColumns: "auto",
          gridAutoRows: "max-content",
          flex: "1 1 300px",
          paddingRight: "var(--blog-conditional-padding)",
        }}
      >
        <h2
          className="large-text"
          style={{ marginBottom: "var(--title-spacing)" }}
        >
          Blog
        </h2>
        <Blogposts data={data.allMarkdownRemark.edges} />
      </Grid>
      <Grid
        style={{
          gridTemplateColumns: "auto",
          gridAutoRows: "max-content",
          flex: "1 1 400px",
        }}
      >
        <h2
          className="large-text"
          style={{ marginBottom: "var(--title-spacing)" }}
        >
          Other Meetups
        </h2>
        <UpcomingMeetups data={data.allMeetup.edges} />
      </Grid>
    </Flex>
    <LearningResources isCarousel isHomepage />
    <Contributing />
  </Layout>
)

export default IndexPage

export const query = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/blog/.*.md$/" } }
      limit: 2
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          timeToRead
          fields {
            slug
          }
          id
          frontmatter {
            title
            date
            author
            isExternal
            externalLink
            featuredImage {
              childImageSharp {
                sizes(
                  maxWidth: 720
                  maxHeight: 360
                  quality: 90
                  toFormat: JPG
                  cropFocus: CENTER
                ) {
                  ...GatsbyImageSharpSizes_withWebp
                }
              }
            }
          }
        }
      }
    }
    allMeetup(
      filter: {
        excerpt: { ne: null }
        title: { ne: null, regex: "/^(?!FreeCodeCamp).*$/gi" }
        location: { ne: null }
        start: { ne: null }
        end: { ne: null }
      }
      limit: 3
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 400)
          description
          title
          location
          start
          end
          iCalUID
        }
      }
    }
  }
`
