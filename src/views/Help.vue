<template>
    <div class="mt-1">
        <simplebar
            style="width:99.5vw; overflow-x:hidden;"
            data-simplebar-auto-hide="false"
            :style="{height: ''.concat(scrollbarHeight).concat('px')}"
        >
            <div class="row mt-1 pl-3" style="width:99.5vw;">
                <div class="col px-1">
                    <help-content />
                </div>
            </div>
        </simplebar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import simplebar from 'simplebar-vue';

import HelpContent from '../components/layout/HelpContent';

export default {
    name: 'Help',
    components: {
        simplebar,
        HelpContent
    },
    created: function() {
        window.addEventListener("resize", this.resizeHandler);
        this.clientHeight = window.innerHeight;
    },
    data: function () {
        return {
            clientHeight: 0,
        };
    },
    computed: {
        ...mapGetters('CommonModule', [
            'navbarHeight',
        ]),
        scrollbarHeight: function() {
            return this.clientHeight - this.navbarHeight - 10;
        },
    },
    methods: {
        resizeHandler() {
            this.clientHeight = window.innerHeight;
        },
    },
};
</script>
