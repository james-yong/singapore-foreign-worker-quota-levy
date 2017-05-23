/*******************************************************************************
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *******************************************************************************/
// @flow
import React from 'react';
import { Form, FormGroup, Col, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import {connect} from 'react-redux'
import {selectSector} from '../actions/index';
import {bindActionCreators} from 'redux';

class SectorSelector extends React.Component {

    constructor(props) {
        super(props);
        (this: any).myServiceChangeHandler = this.myServiceChangeHandler.bind(this);
    }

    myServiceChangeHandler(event){
        this.props.selectSector(event.target.value)
    }

    render() {
        if (!this.props.sector){
            this.props.selectSector("Services")
        }
        return (
          <Form horizontal>
            <FormGroup controlId="sector">
              <Col componentClass={ControlLabel} sm={4}>
                Select your Sector
              </Col>
              <Col sm={8}>
                <FormControl componentClass="select" placeholder="select" onChange={this.myServiceChangeHandler} value={this.props.sector}>
                  <option value="Services">Services</option>
                  <option value="Manufacturing" disabled>Manufacturing</option>
                  <option value="Construction" disabled>Construction</option>
                  <option value="Process" disabled>Process</option>
                  <option value="Marine" disabled>Marine</option>
                </FormControl>
              </Col>
            </FormGroup>
          </Form>
        );
    }
}

function mapStateToProps(state){
    return {
        sector: state.sector
    };
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({selectSector: selectSector}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SectorSelector);