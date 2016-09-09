import * as React from 'react';
import {Table, Column, Cell} from 'fixed-data-table';

import SortHeader from './sortable-header';
import {CounterCell, EditNumCell, NumberCell, TextCell} from './smallcells';

class StartupList extends React.Component {
  constructor(props) {
    super(props);

    this.sorters = {
      'Average' : (a, b) => b.Average - a.Average,
      'Team'    : (a, b) => b.Team - a.Team,
      'Idea'    : (a, b) => b.Idea - a.Idea,
      'Market'  : (a, b) => b.Market - a.Market,
    };

    this.state = {
      data : this.props.data,
      sort : 'Average'
    }
  }

  sort(by) {
    if (!this.sorters[by]) {
      return;
    }

    this.state.data.sort(this.sorters[by])
    this.setState({
      sort : by,
    })
  }

  onDataChange(rowIndex, col, value) {
    let data = this.state.data;
    let parse = parseFloat(value)

    if (!parse) {
      data[rowIndex][col] = 0;
      return '';
    }

    data[rowIndex][col] = parse;
    data[rowIndex]['Average'] = ((data[rowIndex]['Team'] + data[rowIndex]['Idea'] + data[rowIndex]['Market']) / 3);

    this.setState({
      data : data
    })
  }

  render() {
    let sort = this.sort.bind(this);
    let sortedBy = this.state.sort;
    let onDataChange = this.onDataChange.bind(this);

    return (
      <Table 
        rowHeight={40}
        rowsCount={this.state.data.length}
        headerHeight={50}
        width={580}
        maxHeight = {700}
        {...this.props}>
        <Column
          header={<Cell>#</Cell>}
          cell={<CounterCell />}
          width={30}
          fixed={true}
        />
        <Column
          header={<Cell>Name</Cell>}
          cell={<TextCell data={this.state.data} col="Name" />}
          fixed={true}
          width={150}
        />
        <Column
          header={<SortHeader col="Team" sortedBy={sortedBy} onSortChange={sort}/>}
          cell={<EditNumCell onChangeValue={onDataChange} data={this.state.data} col="Team" />}
          width={100}
          fixed={true}
        />
        <Column
          header={<SortHeader col="Idea" sortedBy={sortedBy} onSortChange={sort}/>}
          cell={<EditNumCell onChangeValue={onDataChange} data={this.state.data} col="Idea" />}
          width={100}
          fixed={true}
        />
        <Column
          header={<SortHeader col="Market" sortedBy={sortedBy} onSortChange={sort}/>}
          cell={<EditNumCell onChangeValue={onDataChange}  data={this.state.data} col="Market" />}
          width={100}
          fixed={true}
        />
        <Column
          header={<SortHeader col="Average" sortedBy={sortedBy} onSortChange={sort}/>}
          cell={<NumberCell data={this.state.data} col="Average" />}
          width={100}
          fixed={true}
        />
      </Table>
    )
  }
}

export default StartupList;
