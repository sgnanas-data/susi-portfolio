import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;

  &:not(:last-of-type) {
    margin-bottom: 120px;
  }

  &:nth-of-type(odd) {
    .project-content {
      grid-column: 7 / -1;
      text-align: right;
    }

    .project-image {
      grid-column: 1 / 7;
    }
  }

  .project-content {
    position: relative;
    grid-column: 1 / 7;
    z-index: 2;
  }

  .project-overline {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .project-title {
    color: var(--lightest-slate);
    font-size: clamp(26px, 5vw, 30px);
    margin-bottom: 20px;
  }

  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    background-color: var(--light-navy);
    padding: 24px;
    border-radius: var(--border-radius);
    color: var(--light-slate);
    font-size: var(--fz-lg);

    /* ⭐ KEY FIX */
    max-width: 520px;

    @media (max-width: 1080px) {
      max-width: 480px;
    }

    @media (max-width: 768px) {
      max-width: 100%;
      background-color: transparent;
      box-shadow: none;
      padding: 0;
    }
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      margin-right: 15px;
    }
  }

  .project-links {
    display: flex;
    align-items: center;
    margin-top: 15px;

    a {
      padding: 8px;
    }
  }

  .project-image {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-column: 7 / -1;
    justify-self: end; /* ⭐ KEY FIX */
    position: relative;

    a {
      display: block;
      border-radius: var(--border-radius);
      overflow: hidden;
    }

    .img {
      border-radius: var(--border-radius);
      filter: grayscale(100%) contrast(1) brightness(90%);
      transition: var(--transition);
    }

    a:hover .img {
      filter: none;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    .project-content,
    .project-image {
      grid-column: 1 / -1;
      text-align: left;
    }

    .project-image {
      opacity: 0.25;
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(
                    width: 700
                    placeholder: BLURRED
                    formats: [AUTO, WEBP, AVIF]
                  )
                }
              }
              tech
              github
              external
              cta
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges;
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) =>
      sr.reveal(ref, srConfig(i * 100))
    );
  }, []);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Some of my Ideas
      </h2>

      <StyledProjectsGrid>
        {featuredProjects.map(({ node }, i) => {
          const { frontmatter, html } = node;
          const { title, tech, github, external, cover, cta } = frontmatter;
          const image = getImage(cover);

          return (
            <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
              <div className="project-content">
                <p className="project-overline">Featured Project</p>

                <h3 className="project-title">
                  <a href={external}>{title}</a>
                </h3>

                <div
                  className="project-description"
                  dangerouslySetInnerHTML={{ __html: html }}
                />

                <ul className="project-tech-list">
                  {tech.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>

                <div className="project-links">
                  {cta && (
                    <a href={cta} className="cta">
                      View More
                    </a>
                  )}
                  {github && (
                    <a href={github}>
                      <Icon name="GitHub" />
                    </a>
                  )}
                  {external && !cta && (
                    <a href={external}>
                      <Icon name="External" />
                    </a>
                  )}
                </div>
              </div>

              <div className="project-image">
                <a href={external || github}>
                  <GatsbyImage image={image} alt={title} className="img" />
                </a>
              </div>
            </StyledProject>
          );
        })}
      </StyledProjectsGrid>
    </section>
  );
};

export default Featured;
