import React, { Component } from 'react';
import PropTypes from 'prop-types';

import defaultClassNames from './classNames';
import { SPACE, ENTER } from './keys';

export default class Navbar extends Component {
  static propTypes = {
    classNames: PropTypes.shape({
      navBar: PropTypes.string.isRequired,
      navButtonPrev: PropTypes.string.isRequired,
      navButtonNext: PropTypes.string.isRequired,
    }),
    className: PropTypes.string,
    showPreviousButton: PropTypes.bool,
    showNextButton: PropTypes.bool,
    onPreviousClick: PropTypes.func,
    onNextClick: PropTypes.func,
    dir: PropTypes.string,
    labels: PropTypes.shape({
      previousMonth: PropTypes.string.isRequired,
      nextMonth: PropTypes.string.isRequired,
    }),
    hoveredArrowClassName: PropTypes.string,
  };

  static defaultProps = {
    classNames: defaultClassNames,
    dir: 'ltr',
    labels: {
      previousMonth: 'Previous Month',
      nextMonth: 'Next Month',
    },
    showPreviousButton: true,
    showNextButton: true,
  };

  constructor(props) {
    super(props);

    this.arrowNextRef = React.createRef();
    this.arrowPrevRef = React.createRef();

    this.state = {
      arrowNextHovered: false,
      arrowPrevHovered: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.labels !== this.props.labels ||
      nextProps.dir !== this.props.dir ||
      this.props.showPreviousButton !== nextProps.showPreviousButton ||
      this.props.showNextButton !== nextProps.showNextButton ||
      this.state.arrowNextHovered !== nextState.arrowNextHovered ||
      this.state.arrowPrevHovered !== nextState.arrowPrevHovered
    );
  }

  handleNextClick = () => {
    if (this.props.onNextClick) {
      this.props.onNextClick();
    }
  };

  handlePreviousClick = () => {
    if (this.props.onPreviousClick) {
      this.props.onPreviousClick();
    }
  };

  handleNextKeyDown = e => {
    if (e.keyCode !== ENTER && e.keyCode !== SPACE) {
      return;
    }
    e.preventDefault();
    this.handleNextClick();
  };

  handlePreviousKeyDown = e => {
    if (e.keyCode !== ENTER && e.keyCode !== SPACE) {
      return;
    }
    e.preventDefault();
    this.handlePreviousClick();
  };

  handleStartHover = e => {
    switch (e.target) {
      case this.arrowNextRef.current:
        this.setState({
          arrowNextHovered: true,
        });
        break;
      case this.arrowPrevRef.current:
        this.setState({
          arrowPrevHovered: true,
        });
        break;
      default:
        break;
    }
  };

  handleEndHover = e => {
    switch (e.target) {
      case this.arrowNextRef.current:
        this.setState({
          arrowNextHovered: false,
        });
        break;
      case this.arrowPrevRef.current:
        this.setState({
          arrowPrevHovered: false,
        });
        break;
      default:
        break;
    }
  };

  render() {
    const {
      classNames,
      className,
      showPreviousButton,
      showNextButton,
      labels,
      dir,
      hoveredArrowClassName,
    } = this.props;

    const { arrowPrevHovered, arrowNextHovered } = this.state;

    let previousClickHandler;
    let nextClickHandler;
    let previousKeyDownHandler;
    let nextKeyDownHandler;
    let shouldShowPrevious;
    let shouldShowNext;
    let arrowPrevHoverClassName;
    let arrowNextHoverClassName;

    if (dir === 'rtl') {
      previousClickHandler = this.handleNextClick;
      nextClickHandler = this.handlePreviousClick;
      previousKeyDownHandler = this.handleNextKeyDown;
      nextKeyDownHandler = this.handlePreviousKeyDown;
      shouldShowNext = showPreviousButton;
      shouldShowPrevious = showNextButton;
      arrowPrevHoverClassName = `${arrowNextHovered ? ` ${hoveredArrowClassName}` : ''}`;
      arrowNextHoverClassName = `${arrowPrevHovered ? ` ${hoveredArrowClassName}` : ''}`;
    } else {
      previousClickHandler = this.handlePreviousClick;
      nextClickHandler = this.handleNextClick;
      previousKeyDownHandler = this.handlePreviousKeyDown;
      nextKeyDownHandler = this.handleNextKeyDown;
      shouldShowNext = showNextButton;
      shouldShowPrevious = showPreviousButton;
      arrowPrevHoverClassName = `${arrowPrevHovered ? ` ${hoveredArrowClassName}` : ''}`;
      arrowNextHoverClassName = `${arrowNextHovered ? ` ${hoveredArrowClassName}` : ''}`;
    }

    const previousClassName = shouldShowPrevious
      ? `${classNames.navButtonPrev}${arrowPrevHoverClassName}`
      : `${classNames.navButtonPrev} ${
        classNames.navButtonInteractionDisabled
        }${arrowPrevHoverClassName}`;

    const nextClassName = shouldShowNext
      ? `${classNames.navButtonNext}${arrowNextHoverClassName}`
      : `${classNames.navButtonNext} ${
        classNames.navButtonInteractionDisabled
        }${arrowNextHoverClassName}`;

    const previousButton = (
      <span
        tabIndex="0"
        role="button"
        aria-label={labels.previousMonth}
        key="previous"
        className={previousClassName}
        onKeyDown={shouldShowPrevious ? previousKeyDownHandler : undefined}
        onClick={shouldShowPrevious ? previousClickHandler : undefined}
        onMouseEnter={this.handleStartHover}
        onTouchStart={this.handleStartHover}
        onMouseLeave={this.handleEndHover}
        onTouchEnd={this.handleEndHover}
        ref={this.arrowPrevRef}
      />
    );

    const nextButton = (
      <span
        tabIndex="0"
        role="button"
        aria-label={labels.nextMonth}
        key="right"
        className={nextClassName}
        onKeyDown={shouldShowNext ? nextKeyDownHandler : undefined}
        onClick={shouldShowNext ? nextClickHandler : undefined}
        onMouseEnter={this.handleStartHover}
        onTouchStart={this.handleStartHover}
        onMouseLeave={this.handleEndHover}
        onTouchEnd={this.handleEndHover}
        ref={this.arrowNextRef}
      />
    );

    return (
      <div className={className || classNames.navBar}>
        {dir === 'rtl' ? [nextButton, previousButton] : [previousButton, nextButton]}
      </div>
    );
  }
}
