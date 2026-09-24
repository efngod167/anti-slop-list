import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 999" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">FPS required</div>
                            <p>{{ level.hz || 'Any' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>100%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                    <template v-if="editors">
                        <h3>Staff Team</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>List Rules</h3>
                    <p>
                        The difficulty must be almost all in the spam of the level. You are allowed to put a triple spike or a timing at the end or beginning, unless if it's a chokepoint.
                    </p>
                    <p>
                        You are <b>not</b> allowed to use methods of spamming that require little effort for very high amounts of CPS, such as Drag Clicking or Bolt Clicking. Methods like Button-mashing will be allowed, only if the level is harder than the previous one. This will count for jitter-only levels aswell.
                    </p>
                    <p>
                        A maximum of 2 inputs are allowed when spamming. This will exclude for spammming methods such as Rake, as it isn't mainly considered a spam method.
                    </p>
                    <p>
                        Hardware is specific to each level, as there may be levels that have been verified either uncapped or capped. If the level gets reverified uncapped, the verifier and verification video will be replaced, so will the placement. This will not include levels possible with K55.
                    </p>
                    <p>
                        You <b>must</b> beat the level on the listed framerate - if the level was verified on for ex. 60 FPS, it must be done on 60 FPS. Conpletions with framerates lower/higher than the requirement will be denied, but this does not mean you're not allowed to beat a challenge with CBF if the level's FPS requirement is 240/360.
                    </p>
                    <p>
                        The minimum FPS of your challenge must be from 59 to 360. You're also allowed to use Physics Bypass, but you cannot bypass to 59 or above 240 FPS in 2.2, excluding CBF, as it will be listed as its own framerate.
                    </p>
                    <p>
                        Rebinding keys is allowed as long as you use 2 keys or less!
                    </p>
                    <p>
                        As this may be the Spam Challenge List, levels that break length rules will <b>not</b> be allowed as it must be below 30 seconds. Any arguments about allowing levels will be ignored, as this is a challenge list, <b>not</b> a levels list.
                    </p>
                    <p>
                        If your level is estimated to be from Top 25 to Top 10, make sure to include Raw Footage or Handcam so that we can assure your verification is good to go. Anything that's set to be harder <b>must</b> include raw footage.
                    </p>
                    <p>
                        Your level must not be made in 2 minutes to prevent the list being flooded with badly made levels. This does not apply to historically significant levels, such as <b>the longest what</b>.
                    </p>
                    <p>
                        If your level contains hateful symbols or words, you must be forced to remove them, otherwise your level wouldn't get placed.
                    </p>
                    <p>
                        Reverifications of capped levels are allowed, but will be re-estimated to be in their correct spot unless it heavily affectes the difficulty of the level. A popular example of this is <b>GARBANZO</b> by Needless.
                    </p>
                    <h3>Banned Methods</h3>
                    <p>
                        <b>Any method related to Raking</b> - using your hand to slide against the input keys, letting you gain extremely high CPS.
                    </p>
                    <p>
                        <b>Drag Clicking, Bolt Clicking</b> - dragging your finger on the mouse to also, gain high CPS effortlessly.
                    </p>
                    <p>
                        <b>Lip Spam</b> - using your lips against your screen/input device to gain ridiculous amounts of CPS. You're not allowed to use this method to complete or verify frame-locked challenges.
                    </p>
                    <p>
                        <b>Scroll Clicking</b> - using your scroll wheel to achieve 100+ CPS in no time, even 1,000.
                    </p>
                    <h3>Need help?</h3>
                    <p>
                        If you are unsure about a problem/issue about the list you want to report, make sure to contact list staff members!
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
