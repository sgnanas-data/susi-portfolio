import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const IMAGE_FRAME_HEIGHT = 320; // same height for all featured images
const IMAGE_MAX_WIDTH = 560; // consistent image width

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;

  &:not(:last-of-type) {
    margin-bottom: 120px;
  }

  /* Side-by-side layout */
  .project-inner {
    display: flex;
    align-items: center;
    gap: 40px;
  }

  /* Alternate layout: image left / text right */
  .project-inner.reverse {
    flex-direction: row-reverse;
  }

  /* Text column */
  .project-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center
  }

  /* Keep heading left even on reverse */
  .project-inner.reverse .project-overline,
  .project-inner.reverse .project-title {
    text-align: left;
  }

  .project-overline {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin: 0 0 8px;
  }

  .project-title {
    color: var(--lightest-slate);
    font-size: clamp(26px, 5vw, 30px);
    margin: 0 0 18px;
  }

  /* Description */
  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    background-color: var(--light-navy);
    padding: 24px;
    border-radius: var(--border-radius);
    color: var(--light-slate);
    font-size: var(--fz-lg);

    max-width: 520px;
    text-align: left;

    strong {
      color: var(--lightest-slate);
      display: inline-block;
      margin-top: 10px;
    }

    ul {
      margin: 12px 0 0;
      padding-left: 20px;
      list-style: disc;
      text-align: left;
    }

    li {
      margin: 6px 0;
    }

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
    margin: 18px 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      margin-right: 15px;
      margin-top: 8px;
    }
  }

  .project-links {
    display: flex;
    align-items: center;
    margin-top: 10px;

    a {
      padding: 8px;
    }
  }

  /* Image column */
  .project-image {
    flex: 0 0 ${IMAGE_MAX_WIDTH}px;
    max-width: ${IMAGE_MAX_WIDTH}px;
  }

  .project-image a {
    display: block;
    border-radius: var(--border-radius);
    overflow: hidden;
    width: 100%;
    height: ${IMAGE_FRAME_HEIGHT}px;
    background-color: var(--light-navy);
    ${({ theme }) => theme.mixins.boxShadow};
  }

  /* Now .img IS the image */
  .img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* show full image */
    object-position: center;
    background-color: var(--light-navy);
    display: block;
  }

  /* Mobile stack */
  @media (max-width: 768px) {
    .project-inner,
    .project-inner.reverse {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    .project-inner.reverse .project-overline,
    .project-inner.reverse .project-title {
      text-align: left;
    }

    .project-image {
      width: 100%;
      max-width: 100%;
      flex: 0 0 auto;
    }

    .project-image a {
      height: 260px;
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
              cover
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
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Some of my Ideas
      </h2>

      <StyledProjectsGrid>
        {featuredProjects.map(({ node }, i) => {
          const { frontmatter, html } = node;
          const { title, tech, github, external, cover, cta } = frontmatter;

          const reverse = i % 2 === 1;

          return (
            <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
              <div className={`project-inner ${reverse ? 'reverse' : ''}`}>
                <div className="project-content">
                  <p className="project-overline">Featured Project</p>

                  <h3 className="project-title">
                    <a href={external || github || '#'}>{title}</a>
                  </h3>


                  <div className="project-description" dangerouslySetInnerHTML={{ __html: html }} />

                  <ul className="project-tech-list">
                    {tech?.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>

                  <div className="project-links">
                    {github && (
                      <a href={github} aria-label="GitHub">
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {external && !cta && (
                      <a href={external} aria-label="External Link">
                        <Icon name="External" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="project-image">
                  <a href={external || github || '#'} aria-label={title}>
                    <img src={cover} alt={title} className="img" loading="lazy" />
                  </a>
                </div>
              </div>
            </StyledProject>
          );
        })}
      </StyledProjectsGrid>
    </section>
  );
};

export default Featured;
