<template>
    <div class="text-line-content-container pt-1" :id="toolTipId">
        <b-tooltip :target="toolTipId" placement="top" delay="500" custom-class="tooltip-color-info-box" offset="100">
            <p>{{content}}:{{'\xa0\xa0'}}{{color}}</p>
        </b-tooltip>
       
        <p class="text-center">{{content}}{{'\xa0\xa0'}}
            <span
                class="small-color-box"
                :style="{backgroundColor: color}"
            ></span>
        </p>
    </div>
</template>

<script>

import { uuidv4 } from '../../utilities/createUUID';

export default {
    name: 'ColorInfoBox',
    props: {
        color: {
            default: '#ff0000'
        },
        content: {
            default: ''
        },
    },
    created: function() {
        this.toolTipId = 'toolTip-'.concat(uuidv4()); // make unique id
    },
    data: function () {
      return {
            toolTipId: '',
            
        };
    },

};
</script>
