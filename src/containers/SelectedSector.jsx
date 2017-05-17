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
import renderIf from '../conditions/renderIf.jsx';
import SectorServices from './SectorServices.jsx'
// import SectorManufacturing from './SectorManufacturing.jsx'
// import SectorConstruction from './SectorConstruction.jsx'
// import SectorProcess from './SectorProcess.jsx'
// import SectorMarine from './SectorMarine.jsx'
import {connect} from 'react-redux'

class SelectedSector extends React.Component {
      render() {
            return (
                  <div>
                        {renderIf(this.props.sector=="Services", <SectorServices />)}
                        {/* renderIf(this.props.sector=="Manufacturing", <SectorManufacturing />) */}
                        {/* renderIf(this.props.sector=="Construction", <SectorConstruction />) */}
                        {/* renderIf(this.props.sector=="Process", <SectorProcess />) */}
                        {/* renderIf(this.props.sector=="Marine", <SectorMarine />) */}
                  </div>
            );
      }
}

function mapStateToProps(state){
    return {
        sector: state.sector
    };
}

export default connect(mapStateToProps)(SelectedSector);