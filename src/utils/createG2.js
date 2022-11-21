import React from 'react';
import PropTypes from 'prop-types';

export default function createG2(__operation) {
  class Component extends React.Component {
    constructor(props, context) {
      super(props, context);
      const { chartId } = props;
      this.chart = null;
      this.chartId = chartId;
    }

    componentDidMount() {
      this.initChart(this.props);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      if (!this.chart) {
        return;
      }
      const { data: newData } = newProps;
      const { data: oldData } = this.props;

      if (newData !== oldData) {
        this.chart.changeData(newData);
      }
    }

    shouldComponentUpdate() {
      return false;
    }

    componentWillUnmount() {
      if (!this.chart) {
        return;
      }
      this.chart.destroy();
      this.chart = null;
      this.chartId = null;
    }

    initChart = async (props) => {
      const { Chart } = (await import('@antv/g2'));
      const { chartConfig, data, additionInfo } = props;
      const chart = new Chart(
        { ...chartConfig, container: this.chartId, autoFit: true },
      );
      this.chart = chart;
      chart.data(data);
      __operation(chart, additionInfo);
    };

    render() {
      return (
        <div
          style={{ height: '100%' }}
          id={this.chartId}
        />
      );
    }
  }

  Component.propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object,
    ]).isRequired,
    chartConfig: PropTypes.shape({}).isRequired,
    chartId: PropTypes.string.isRequired,
    additionInfo: PropTypes.shape({}),
  };

  Component.defaultProps = {
    additionInfo: {},
  };

  return Component;
}
