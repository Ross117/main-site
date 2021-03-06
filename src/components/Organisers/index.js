import React from "react"
import Card from "../Card"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

import Center from "../Center"
import Carousel from "../Carousel"
import Logo from "../Logo"
import styles from "./organisers.module.scss"

const Index = () => {
  const data = useStaticQuery(graphql`
    query {
      adam: file(relativePath: { eq: "organiser-adam.jpg" }) {
        ...organiserImage
      }
      james: file(relativePath: { eq: "organiser-james.jpg" }) {
        ...organiserImage
      }
      pete: file(relativePath: { eq: "organiser-pete.jpg" }) {
        ...organiserImage
      }
      fey: file(relativePath: { eq: "organiser-fey.jpg" }) {
        ...organiserImage
      }
    }

    fragment organiserImage on File {
      childImageSharp {
        fluid(maxWidth: 56, maxHeight: 56, quality: 80) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  `)

  let organisers = [
    {
      name: "James Davenport",
      twitter: {
        username: "@JD_aka_Techy",
        link: "https://twitter.com/JD_aka_Techy",
      },
      github: {
        username: "JD_aka_Techy",
        link: "https://github.com/JD-aka-Techy",
      },
      description: `
        FCC Alum, Full stack JS & C#, poor ukulele player and source of
        many donuts
        <span role="img" aria-label="donut">
          🍩
        </span>
      `,
      languages: ["javascript", "node", "react"],
    },
    {
      name: "Adam Collier",
      twitter: {
        username: "@collieradam",
        link: "https://twitter.com/collieradam",
      },
      github: {
        username: "Adam-Collier",
        link: "https://github.com/Adam-Collier",
      },
      description: `
        Design/Developer guy @Missguided. Side project initiator. Always
        making stuff. Currently 82% tea
        <span role="img" aria-label="peace">
          ✌️
        </span>
      `,
      languages: ["html", "css", "javascript", "node", "react"],
    },
    {
      name: "Pete Daily",
      twitter: {
        username: "@peterdaily",
        link: "https://twitter.com/peterdaily",
      },
      github: {
        username: "thepeted",
        link: "https://github.com/thepeted",
      },
      description: `
        Bit of a geek. Self taught Front end web developer. Long suffering
        Stockport County fan.
      `,
      languages: ["html", "css", "javascript", "angular", "node", "react"],
    },
    {
      name: "Fey Ijaware",
      twitter: {
        username: "@feyagape",
        link: "https://twitter.com/feyagape",
      },
      github: {
        username: "FeyAgape",
        link: "https://github.com/FeyAgape",
      },
      description: `
        Self-taught developer and senior developer @dwpdigital. Founder of CodeandStuff & CodePossible.
      `,
      languages: ["javascript", "node", "react"],
    },
  ]

  return (
    <>
      <Center>
        <h2 className={`${styles.title} large-text`}>The Organisers</h2>
      </Center>

      <Carousel>
        {organisers.map((organiser, i) => (
          <Card key={i} shadowType="hover" className={`${styles.organiser}`}>
            <div className={styles.grid}>
              <Img
                fluid={
                  data[organiser.name.split(" ")[0].toLowerCase()]
                    .childImageSharp.fluid
                }
              />
              <div>
                <h3>{organiser.name}</h3>
                <a href={organiser.github.link}>Github</a>
                <a href={organiser.twitter.link}>Twitter</a>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: organiser.description }}
              ></p>
              <p>
                I can help with:
                <span>
                  {organiser.languages.map((language, i) => {
                    return <Logo key={i} name={language} />
                  })}
                </span>
              </p>
            </div>
          </Card>
        ))}
      </Carousel>
    </>
  )
}

export default Index
