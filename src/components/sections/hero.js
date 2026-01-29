import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;

  /* ✅ EMERGENCY FIX: Significantly increase top padding */
  padding-top: calc(var(--nav-height) + 80px) !important; /* Increased to 80px */
  padding-left: 24px;
  padding-right: 24px;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: calc(var(--nav-height) + 80px) !important; /* Also updated here */
  }

  h1 {
    /* ✅ Add margin-top to push it even further down */
    margin: 20px 0 20px 4px !important; /* Added top margin */
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;
    z-index: 1;
    position: relative;
    /* Ensure text doesn't get cut at top */
    padding-top: 8px !important;

    @media (max-width: 480px) {
      margin: 20px 0 16px 2px !important;
    }
  }

  .big-heading {
    margin: 0;
    font-size: clamp(40px, 8vw, 80px);
    line-height: 1.1;
  }

  .medium-heading {
    margin: 10px 0 0 0;
    color: var(--slate);
    font-size: clamp(20px, 4vw, 40px);
    line-height: 1.1;
  }

  p {
    margin: 24px 0 0;
    max-width: 540px;
    line-height: 1.5;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
    position: relative;
    z-index: 1;
  }
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const one = <h1>Glad to e-meet you! My name is</h1>;
  const two = <h2 className="big-heading">Susitra Gnanasambhandam</h2>;
  const three = (
    <h3 className="medium-heading">Data Analyst | BI &amp; Analytics | Healthcare &amp; Technology</h3>
  );

  const four = (
    <>
      <p>I turn messy data into dashboards people actually use.</p>

      <p>
        I'm currently a <b>Data Analyst</b> (Power BI, SQL, SSIS, DAX). Previously, I worked as a{' '}
        <b>SQL/Power BI Developer</b>. Before that, I was a <b>Research Intern</b> at{' '}
        <a href="https://www.brighamandwomens.org/" target="_blank" rel="noreferrer">
          Brigham and Women's Hospital (Harvard Medical School)
        </a>
        .
      </p>

      <p>
        Lately, I've been building a small "local guide" style project for Clemson. It's a clean, searchable hub for
        campus and city info like food spots, quick picks, and useful links. More updates soon.
      </p>
    </>
  );

  const five = (
    <a className="email-link" href="mailto:susitragnanasambhandam@gmail.com">
      Say hi
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection id="home">
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;