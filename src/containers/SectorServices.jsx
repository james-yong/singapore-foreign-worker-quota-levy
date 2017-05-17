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
import React from 'react';
import { Panel, Form, FormGroup, Col, ControlLabel, FormControl, Button, HelpBlock, Table } from 'react-bootstrap';
import {connect} from 'react-redux'
import {updateNumLocalEmp, updateNumSPass, updateNumChnBasicWPass, updateNumChnHigherWPass, updateNumMysBasicWPass, updateNumMysHigherWPass} from '../actions/index';
import {bindActionCreators} from 'redux';
import math from 'mathjs';
import renderIf from '../conditions/renderIf.jsx';

class SectorServices extends React.Component {

    constructor(props) {
        super(props);
        math.config({
          number: 'BigNumber',  // Default type of number: 'number' (default), 'BigNumber', or 'Fraction'
          precision: 20         // Number of significant digits for BigNumbers
        });
        this.totalEmp = this.totalEmp.bind(this);
        this.totalEmpForeign = this.totalEmpForeign.bind(this);
        this.totalEmpSPass = this.totalEmpSPass.bind(this);
        this.totalEmpChnWPass = this.totalEmpChnWPass.bind(this);
        this.totalEmpMysWPass = this.totalEmpMysWPass.bind(this);
        this.totalBasicWPass = this.totalBasicWPass.bind(this);
        this.totalHigherWPass = this.totalHigherWPass.bind(this);
        this.totalLevy = this.totalLevy.bind(this);

        this.quotaSPass = this.quotaSPass.bind(this);
        this.quotaSPassTier1 = this.quotaSPassTier1.bind(this);
        this.quotaChnWPass = this.quotaChnWPass.bind(this);
        this.quotaMysWPass = this.quotaMysWPass.bind(this);
        this.quotaWPassTier1 = this.quotaWPassTier1.bind(this);
        this.quotaWPassTier2 = this.quotaWPassTier2.bind(this);
        this.quotaWPassTier3 = this.quotaWPassTier3.bind(this);

        this.changeNumLocalEmp = this.changeNumLocalEmp.bind(this);
        this.changeNumSPass = this.changeNumSPass.bind(this);
        this.changeNumChnBasicWPass = this.changeNumChnBasicWPass.bind(this);
        this.changeNumChnHigherWPass = this.changeNumChnHigherWPass.bind(this);
        this.changeNumMysBasicWPass = this.changeNumMysBasicWPass.bind(this);
        this.changeNumMysHigherWPass = this.changeNumMysHigherWPass.bind(this);

        this.feedbackIfQuotaIsNegative = this.feedbackIfQuotaIsNegative.bind(this);

        this.renderSPassPanels = this.renderSPassPanels.bind(this);
        this.renderSPassPanel = this.renderSPassPanel.bind(this);
        this.calculateSPassPanel = this.calculateSPassPanel.bind(this);
        this.renderWPassPanels = this.renderWPassPanels.bind(this);
        this.renderWPassPanel = this.renderWPassPanel.bind(this);
        this.calculateWPassPanel = this.calculateWPassPanel.bind(this);
        
        this.styles = {
          textRight: {textAlign: 'right'},
          contentCentered: {display: 'flex', justifyContent: 'center'}

        };
    }

    totalEmp(){
      return math.chain(+this.props.numLocalEmp || 0).add(this.totalEmpForeign()).done();
    }
    totalEmpForeign(){
      return math.chain(+this.props.numSPass || 0).add(this.totalEmpChnWPass()).add(this.totalEmpMysWPass()).done();
    }
    totalEmpSPass(){
      return math.chain(+this.props.numSPass || 0).done();
    }
    totalEmpChnWPass(){
      return math.chain(+this.props.numChnBasicWPass || 0).add(+this.props.numChnHigherWPass || 0).done();
    }
    totalEmpMysWPass(){
      return math.chain(+this.props.numMysBasicWPass || 0).add(+this.props.numMysHigherWPass || 0).done();
    }
    totalBasicWPass(){
      return math.chain(+this.props.numChnBasicWPass || 0).add(+this.props.numMysBasicWPass || 0).done();
    }
    totalHigherWPass(){
      return math.chain(+this.props.numChnHigherWPass || 0).add(+this.props.numMysHigherWPass || 0).done();
    }
    totalEmpHigherWPassTier1(){
      return Math.min(this.quotaWPassTier1(), this.totalHigherWPass());
    }
    totalEmpBasicWPassTier1(){
      if (this.totalEmpBasicWPassTier1()<this.quotaWPassTier1()){
        return Math.min(this.quotaWPassTier1(), this.totalBasicWPass());
      } else {
        return 0;
      }
    }
    totalLevy(){
      let tiers = [1,2,3];
      let sum = 0;
      let x1 = {higherWPass:this.totalHigherWPass(), basicWPass:this.totalBasicWPass(), levyWPass: 0 };
      tiers.map((val) => {
        if (x1.higherWPass>0 || x1.basicWPass>0){
          this.calculateWPassPanel(val, x1);
        } 
      });
      sum += x1.levyWPass;

      let panels = [1,2];
      x1 = {"sPass":this.totalEmpSPass(), "levySPass":0 };
      panels.map((val) => {
        if (x1.sPass>0){
          this.calculateSPassPanel(val, x1)
        } 
      });
      sum += x1.levySPass;

      return sum;
    }

    quotaSPass(){
        return math.chain(this.totalEmp()).multiply(0.15).floor().done();
    }
    // Service Sector: Up to 10% of the total workforce
    quotaSPassTier1(){
        return math.chain(this.totalEmp()).multiply(math.bignumber(0.1)).floor().done();
    }
    // Service Sector: Above 10% to 25% of the total workforce
    quotaSPassTier2(){
        return math.chain(this.totalEmp()).multiply(0.05).floor().done();
    }
    quotaChnWPass(){
       return math.chain(this.totalEmp()).multiply(0.08).floor().done();
    }
    // Service Sector: FW Quota is 40% which is Local FTE x 0.666667
    quotaMysWPass(){
       return math.chain(+this.props.numLocalEmp || 0).multiply(0.666667).floor().done();
    }
    // Service Sector: Up to 10% of the total workforce 
    quotaWPassTier1(){
        return math.chain(this.totalEmp()).multiply(math.bignumber(0.1)).floor().done();
    }
    // Service Sector: Above 10% to 25% of the total workforce
    quotaWPassTier2(){
        return math.chain(this.totalEmp()).multiply(math.bignumber(0.15)).floor().done();
    }
    // Service Sector: Above 25% to 40% of the total workforce 
    quotaWPassTier3(){
        return math.chain(this.totalEmp()).multiply(math.bignumber(0.15)).floor().done();
    }

    changeNumLocalEmp(event){
        this.props.updateNumLocalEmp(event.target.value)
    }
    changeNumSPass(event){
        this.props.updateNumSPass(event.target.value)
    }
    changeNumChnBasicWPass(event){
        this.props.updateNumChnBasicWPass(event.target.value)
    }
    changeNumChnHigherWPass(event){
        this.props.updateNumChnHigherWPass(event.target.value)
    }
    changeNumMysBasicWPass(event){
        this.props.updateNumMysBasicWPass(event.target.value)
    }
    changeNumMysHigherWPass(event){
        this.props.updateNumMysHigherWPass(event.target.value)
    }

    feedbackIfQuotaIsNegative(quota){
      if (quota<0){
        return <label className="error">Quota Exceeded</label>;
      } else {
        return quota;
      }
    }

    renderWPassPanels(){
      let tiers = [1,2,3];
      let result = [];
      let x1 = {"higherWPass":this.totalHigherWPass(), "basicWPass":this.totalBasicWPass(), "levyWPass": 0 };
      tiers.map((val) => {
        if (x1.higherWPass>0 || x1.basicWPass>0){
          result.push( this.renderWPassPanel(val, x1) );
        } 
        
      });
      return result;
    }

    calculateWPassPanel(i, x1){

        // get tier quota
        var quota = 0;
        switch(i){
          case 1:{
            quota = this.quotaWPassTier1();
          } break;
          case 2:{
            quota = this.quotaWPassTier2();
          } break;
          case 3:{
            quota = this.quotaWPassTier3();
          } break;
        }

        var higherWPassAllocation = 0;
        var basicWPassAllocation = 0;

        if (quota>0 && x1.higherWPass>0){
          higherWPassAllocation = Math.min(quota, x1.higherWPass);
          x1.higherWPass -= higherWPassAllocation;
          quota -= higherWPassAllocation;
        }

        if (quota>0 && x1.basicWPass>0){
          basicWPassAllocation = Math.min(quota, x1.basicWPass);
          x1.basicWPass -= basicWPassAllocation
          quota -= basicWPassAllocation
        }

        var higherWPassAllocationRate = 0;
        var basicWPassAllocationRate = 0;
        switch(i){
          case 1:{
            higherWPassAllocationRate = 300;
            basicWPassAllocationRate = 450;
          } break;
          case 2:{
            higherWPassAllocationRate = 400;
            basicWPassAllocationRate = 600;
          } break;
          case 3:{
            higherWPassAllocationRate = 600;
            basicWPassAllocationRate = 800;
          } break;
        }
        var higherWPassAllocationAmount = math.chain(higherWPassAllocation).multiply(higherWPassAllocationRate).done();
        var basicWPassAllocationAmount = math.chain(basicWPassAllocation).multiply(basicWPassAllocationRate).done();
        x1.levyWPass += (higherWPassAllocationAmount + basicWPassAllocationAmount);

        return {higherWPassAllocation, higherWPassAllocationRate, higherWPassAllocationAmount, basicWPassAllocation, basicWPassAllocationRate, basicWPassAllocationAmount};

    }

    renderWPassPanel(i, x1){

        var result = this.calculateWPassPanel(i, x1);
        
        return (
              <Panel header={"Tier "+i} key={i}>
                <div className="pull-right">
                  {renderIf(result.higherWPassAllocation>0, <div>{result.higherWPassAllocation} x ${result.higherWPassAllocationRate} = ${result.higherWPassAllocationAmount}</div>)}
                  {renderIf(result.basicWPassAllocation>0, <div>{result.basicWPassAllocation} x ${result.basicWPassAllocationRate} = ${result.basicWPassAllocationAmount}</div>)}
                </div>
              </Panel>
            );
    }

    renderSPassPanels(){
      let panels = [1,2];
      let result = [];
      let x1 = {"sPass":this.totalEmpSPass(), "levySPass":0 };
      panels.map((val) => {
        if (x1.sPass>0){
          result.push( this.renderSPassPanel(val, x1) );
        } 
      });
      return result;
    }

    calculateSPassPanel(i, x1){

      // get tier quota
        var quota = 0;
        switch(i){
          case 1:{
            quota = this.quotaSPassTier1()
          } break;
          case 2:{
            quota = this.quotaSPassTier2()
          } break;
        }

        var sPassAllocation = 0;

        if (quota>0 && x1.sPass>0){
          sPassAllocation = Math.min(quota, x1.sPass);
          x1.sPass -= sPassAllocation;
          quota -= sPassAllocation;
        }

        var sPassAllocationRate = 0;
        switch(i){
          case 1:{
            sPassAllocationRate = 330;
          } break;
          case 2:{
            sPassAllocationRate = 650;
          } break;
        }
        var sPassAllocationAmount = math.chain(sPassAllocation).multiply(sPassAllocationRate).done();
        x1.levySPass += sPassAllocationAmount;

        return {sPassAllocation, sPassAllocationRate, sPassAllocationAmount};

    }

    renderSPassPanel(i, x1){

        var result = this.calculateSPassPanel(i, x1);
        
        return (
              <Panel header={"Tier "+i} key={i}>
                <div className="pull-right">
                  <div>{result.sPassAllocation} x ${result.sPassAllocationRate} = ${result.sPassAllocationAmount}</div>
                </div>
              </Panel>
            );
    }


    render() {
        return (
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th className="col-xs-4">Workforce</th>
                  <th className="col-xs-3">Number of employees</th>
                  <th className="col-xs-2">Remaining Quota</th>
                  <th className="col-xs-3">Levy</th>
                </tr>
              </thead>
              <tbody>
                 <tr>
                    <td><strong>Full-time Local Employees (LE)</strong><br/>
                    Local employees are Singapore citizens or PRs earning at least the full-time equivalent salary.
                    </td>
                    <td>
                    <Col sm={12}><FormControl type="text" id="fullTime" value={this.props.numLocalEmp} onChange={this.changeNumLocalEmp} style={this.styles.textRight}/></Col>
                    </td>
                    <td>
                      <div style={this.styles.contentCentered}>N/A</div>
                    </td>
                    <td>
                      <div style={this.styles.contentCentered}>N/A</div>
                    </td>
                </tr>
                 <tr>
                      <td><strong>S Pass Holders (SP)</strong><br/>
                      The S Pass holders.<br/>
                      Sub-quota is <strong>15%</strong> of your total (local + foreign) workforce
                      </td>
                      <td>
                        <Col sm={12}>
                            <FormControl type="text" id="sPassHolder" value={this.props.numSPass} onChange={this.changeNumSPass} style={this.styles.textRight} />
                        </Col>
                      </td>
                      <td>
                        <div style={this.styles.contentCentered}>{this.feedbackIfQuotaIsNegative(math.chain(this.quotaSPass()).subtract(+this.props.numSPass || 0).done())}</div>
                      </td>
                      <td>
                        {this.renderSPassPanels()}
                      </td>
                 </tr>
                 <tr>
                      <td><strong>PRC Work Permit (CP)</strong><br/>
                      The PRC Work Permit holders.<br/>
                      Sub-quota is <strong>8%</strong> of your total (local + foreign) workforce
                      </td>
                      <td>
                        <Col sm={6}>
                            <FormControl type="text" id="prcSkilled" value={this.props.numChnHigherWPass} onChange={this.changeNumChnHigherWPass} style={this.styles.textRight}/>
                            <HelpBlock>Higher-Skilled</HelpBlock>
                        </Col>
                        <Col sm={6}>
                            <FormControl type="text" id="prcUnskilled" value={this.props.numChnBasicWPass} onChange={this.changeNumChnBasicWPass} style={this.styles.textRight}/>
                            <HelpBlock>Basic-Skilled</HelpBlock>
                        </Col>
                      </td>
                      <td>
                          <div style={this.styles.contentCentered}>{this.feedbackIfQuotaIsNegative(math.chain(this.quotaChnWPass()).subtract(this.totalEmpChnWPass()).done())}</div>
                      </td>
                      <td rowSpan="2">
                        {this.renderWPassPanels()}
                      </td>
                 </tr>
                 <tr>
                    <td><strong>Malaysian / NAS Work Permit (MN)</strong><br/>
                    North Asian source (NAS) refers to Taiwan, South Korea, Macau and Hong Kong. <br/>
                    Sub-quota is <strong>60%</strong> of LE, subtracted by the total hired for SP & CP.
                    </td>
                    <td>
                      <Col sm={6}>
                          <FormControl type="text" id="malSkilled" value={this.props.numMysHigherWPass} onChange={this.changeNumMysHigherWPass} style={this.styles.textRight}/>
                          <HelpBlock>Higher-Skilled</HelpBlock>
                      </Col>
                      <Col sm={6}>
                          <FormControl type="text" id="malUnskilled" value={this.props.numMysBasicWPass} onChange={this.changeNumMysBasicWPass} style={this.styles.textRight}/>
                          <HelpBlock>Basic-Skilled</HelpBlock>
                      </Col>
                    </td>
                    <td>
                        <div style={this.styles.contentCentered}>{this.feedbackIfQuotaIsNegative(math.chain(this.quotaMysWPass()).subtract(this.totalEmpForeign()).done())}</div>
                    </td>
                 </tr>
                 <tr>
                   <td><strong>Total foreign workers</strong></td>
                   <td><div style={this.styles.contentCentered}>{this.totalEmpForeign()}</div></td>
                   <td><div style={this.styles.contentCentered}>{math.chain(this.quotaMysWPass()).subtract(this.totalEmpForeign()).done()}</div></td>
                   <td><div className="pull-right">${this.totalLevy()}</div></td>
                 </tr>
              </tbody>
            </Table>
        );
    }
}

function mapStateToProps(state){
    return {
        numLocalEmp: state.numLocalEmp,
        numSPass: state.numSPass,
        numChnBasicWPass: state.numChnBasicWPass,
        numChnHigherWPass: state.numChnHigherWPass,
        numMysBasicWPass: state.numMysBasicWPass,
        numMysHigherWPass: state.numMysHigherWPass
    };
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({updateNumLocalEmp, updateNumSPass, updateNumChnBasicWPass, updateNumChnHigherWPass, updateNumMysBasicWPass, updateNumMysHigherWPass}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SectorServices);