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
export function selectSector(sector){
    // selectSector is an ActionCreator, it needs to return an action,
    // an object with a type property. 
    return {
        type: 'SECTOR_SELECTED',
        payload: sector
    };
}

export function updateNumLocalEmp(value){
    return {
        type: 'UPDATE_NUM_LOCAL_EMP',
        payload: value
    };
}

export function updateNumSPass(value){
    return {
        type: 'UPDATE_NUM_S_PASS',
        payload: value
    };
}

export function updateNumChnBasicWPass(value){
    return {
        type: 'UPDATE_NUM_CHN_BASIC_W_PASS',
        payload: value
    };
}

export function updateNumChnHigherWPass(value){
    return {
        type: 'UPDATE_NUM_CHN_HIGHER_W_PASS',
        payload: value
    };
}

export function updateNumMysBasicWPass(value){
    return {
        type: 'UPDATE_NUM_MYS_BASIC_W_PASS',
        payload: value
    };
}

export function updateNumMysHigherWPass(value){
    return {
        type: 'UPDATE_NUM_MYS_HIGHER_W_PASS',
        payload: value
    };
}