import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faShareAlt, faDownload, faTools, faPlay, faCheck, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Spacer from './Spacer';
import Ace from './Ace';

const defaultCode = `#include <bits/stdc++.h>
using namespace std;

typedef long long LL;
const double PI = 4 * atan(1);

#define MAXN 100013
int N;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(0);

    cin >> N;

    cout.flush();
    return 0;
}
`;

class Editor extends Component {
  state = { code: defaultCode }
  handleChange = this.handleChange.bind(this);

  handleChange(code) {
    this.setState({ code });
    if (this.props.onChange)
      this.props.onChange(code);
  }

  componentDidMount() {
    this.handleChange(this.state.code);
  }

  render() {
    return (
      <div className="editor-area">
        <div className="editor-menu">
          <button><FontAwesomeIcon icon={faUpload} /> Load</button>
          <Spacer />
          <button><FontAwesomeIcon icon={faShareAlt} /> Share</button>
          <button><FontAwesomeIcon icon={faDownload} /> Download</button>
        </div>

        <Ace
          mode="c_cpp"
          value={this.state.code}
          onChange={this.handleChange}
        />

        <div className="editor-menu">
          <button><FontAwesomeIcon icon={faTools} /> Compile</button>
          <Spacer />
          <button onClick={this.props.onRun}><FontAwesomeIcon icon={faPlay} /> Run</button>
          <button><FontAwesomeIcon icon={faCheck} /> Test</button>
          <button><FontAwesomeIcon icon={faPaperPlane} /> Submit</button>
        </div>
      </div>
    );
  }
}

export default Editor;
