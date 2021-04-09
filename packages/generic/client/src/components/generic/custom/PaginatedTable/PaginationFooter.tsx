import React from 'react';
import styled from 'styled-components';
import { Icon, Text } from '../../../../components';
import { customThemeType, useCustomTheme } from '../../../../styles';
import { computeDisplayedPages } from './lib';

export { PaginationFooter };

const HEIGHT = 68;

const PAGE_SIZE = 30;

function PaginationFooter(props: {
  currentPage: number;
  numberOfPages: number;
  setCurrentPage: (currentPage: number) => void;
}) {
  const theme = useCustomTheme();
  const styles = buildStyles(theme);
  const displayedPages = computeDisplayedPages(props.currentPage, props.numberOfPages);
  const { ClickableDiv } = buildStyledComponents();

  return (
    <div style={styles.container}>
      <div style={styles.pagesContainer}>
        <ClickableDiv onClick={() => (props.currentPage > 0 ? props.setCurrentPage(props.currentPage - 1) : null)}>
          <Icon iconName="arrowLeft" />
        </ClickableDiv>
        {displayedPages.map(renderContent)}
        <ClickableDiv
          onClick={() =>
            props.currentPage < props.numberOfPages - 1 ? props.setCurrentPage(props.currentPage + 1) : null
          }
        >
          <Icon iconName="arrowRight" />
        </ClickableDiv>
      </div>
    </div>
  );

  function renderContent(content: { kind: 'page'; value: number } | { kind: 'blank' }) {
    switch (content.kind) {
      case 'page':
        return (
          <ClickableDiv
            isSelected={props.currentPage === content.value}
            onClick={() => props.setCurrentPage(content.value)}
          >
            <Text variant="h3">{content.value + 1}</Text>
          </ClickableDiv>
        );
      case 'blank':
        return (
          <div style={styles.blank}>
            <Text variant="h3">...</Text>
          </div>
        );
    }
  }

  function buildStyledComponents() {
    type stylePropsType = { isSelected?: boolean };
    const ClickableDiv = styled.div<stylePropsType>`
      ${({ isSelected }) => {
        return `
      width: ${PAGE_SIZE}px;
      height: ${PAGE_SIZE}px;
      border-radius: ${PAGE_SIZE / 2}px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: ${theme.spacing}px;
      ${
        isSelected
          ? `
          background-color: ${theme.colors.default.hoveredBackground};
          color: ${theme.colors.default.hoveredTextColor};
        `
          : `
      &:hover {
        background-color: ${theme.colors.default.background};
      }
      `
      }
    }
    `;
      }}
    `;

    return { ClickableDiv };
  }
}

function buildStyles(theme: customThemeType) {
  return {
    container: {
      height: `${HEIGHT}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pagesContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    blank: {
      marginRight: theme.spacing,
    },
  };
}
