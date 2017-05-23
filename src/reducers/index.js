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
import { combineReducers } from 'redux';
import ActiveSector from './reducer_sector';
import NumLocalEmp from './reducer_numLocalEmp';
import NumSPass from './reducer_numSPass';
import NumChnBasicWPass from './reducer_numChnBasicWPass';
import NumChnHigherWPass from './reducer_numChnHigherWPass';
import NumMysBasicWPass from './reducer_numMysBasicWPass';
import NumMysHigherWPass from './reducer_numMysHigherWPass';

const rootReducer = combineReducers({
  sector: ActiveSector,
  numLocalEmp: NumLocalEmp,
  numSPass: NumSPass,
  numChnBasicWPass: NumChnBasicWPass,
  numChnHigherWPass: NumChnHigherWPass,
  numMysBasicWPass: NumMysBasicWPass,
  numMysHigherWPass: NumMysHigherWPass
});

export default rootReducer;
