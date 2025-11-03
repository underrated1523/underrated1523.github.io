<template>
    <h1>
      My Anime Tier List
    </h1>
  
    <div class="tierlist-wrapper">
      <div v-for="(row, rowIndex) in rows" :key="row.id" class="tier-row">
        <div class="button-group" v-if="isEditMode">
            <button @click="addRowAbove(rowIndex)">↑</button>
            <button @click="delRow(rowIndex)">✕</button>
            <button @click="addRowBelow(rowIndex)">↓</button>
        </div>
      
        <dev class="label-wrapper">
          <input 
            v-model="row.labelName" 
            type="text" 
            class="label-input"
            :style="{ backgroundColor: row.color || '#ffffff' }"
            @change="renameLabel(rowIndex, row.labelName)"
            />
          <input 
            v-if="isEditMode"
            type="color" 
            v-model="row.color"
            class="color-picker"
            title="色変更"
            @change="changeLabelColor(rowIndex, row.color)"
          />
        </dev>
        <draggable :list="row.items" group="items" item-key="animeId" tag="ul" ghost-class="ghost" class="items" @change="updateAnimeTier">
            <template #item="{element}">
                <li @mouseenter="startHover(element.animeTitle)" 
                    @mouseleave="cancelHover">
                    <img :src= "element.image" 
                        :alt="element.title" 
                        @click="handleAnimeClick(element)"
                        @contextmenu.prevent="removeAnimeFromRow(element.animeId)"
                    >
                    <span v-if="hoverTitle === element.animeTitle" class="tooltip">{{ element.animeTitle }}</span>
                </li>
            </template>
            <template #footer>
                <li class="ghost"></li>
            </template>
        </draggable>
    </div>
</div>


  <!-- mode changer -->
  <div class="mode-toggle">
    <button @click="toggleEditMode">
      {{ isEditMode ? "To View Mode" : "To Edit Mode" }}
    </button>
  </div>

  <AnimeSearch v-if="isEditMode" @add="addAnimeToList" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firestore'
import draggable from 'vuedraggable'
import AnimeSearch from './AnimeSearch.vue'
import AnimeTierModel from '../models/animeTierModel'
import { selectTierData, registAnimeTier, usertest, updateTierData, deleteTierData, updateUserData } from "../firestore.js";
import { collection, query, where, onSnapshot } from 'firebase/firestore'

defineProps({
  msg: String,
})

// ======= state =======
const rows = ref([])
const hoverTitle = ref(null)
let hoverTimer = null
const isEditMode = ref(true)

// ======= methods =======
function toggleEditMode() {
  isEditMode.value = !isEditMode.value
}

function startHover(title) {
  hoverTimer = setTimeout(() => {
    hoverTitle.value = title
  }, 1000)
}

function cancelHover() {
  clearTimeout(hoverTimer)
  hoverTitle.value = null
}

function addRowAbove(rowIndex) {
  rows.value.splice(rowIndex, 0, { labelName: 'New Row', items: [], color: '#ffffff' })
  updateUserData(0, rowIndex, null);
}

function addRowBelow(rowIndex) {
  rows.value.splice(rowIndex + 1, 0, { labelName: 'New Row', items: [], color: '#ffffff' })
  updateUserData(1, rowIndex, null);
}

function delRow(rowIndex) {
  rows.value.splice(rowIndex, 1)
  updateUserData(2, rowIndex, null);
}

function renameLabel(rowIndex, afterLabelName) {
  updateUserData(3, rowIndex, afterLabelName);
}

function changeLabelColor(rowIndex, color) {
  updateUserData(4, rowIndex, color);
}
  
function addAnimeToList(media) {
  const animeTierModel = new AnimeTierModel()
  animeTierModel.animeTitle = media.title.native
  animeTierModel.animeId = media.id
  animeTierModel.image = media.coverImage.large
  animeTierModel.url = media.siteUrl
  animeTierModel.labelName = '画像リスト'
  animeTierModel.comment = '最高だった！'
  registAnimeTier(animeTierModel)
}

function updateAnimeTier(evt) {
  if (evt.added) {
    const movedAnime = evt.added.element
    const newRowIndex = rows.value.findIndex((r) => r.items.includes(movedAnime))

    const newLabelName = rows.value[newRowIndex].labelName
    const animeId = movedAnime.animeId

    updateTierData(newLabelName, animeId)
  }
}

function removeAnimeFromRow(animeId) {
  if (isEditMode.value) {
    deleteTierData(animeId)
  }
}

function handleAnimeClick(anime) {
  if (!isEditMode.value && anime.url) {
    window.open(anime.url, '_blank')
  }
}

// ======= lifecycle =======
onMounted(async () => {
  const userId = localStorage.getItem('userId')
  const q = query(collection(db, 'tiers'), where('userId', '==', userId))

  onSnapshot(q, async (snapshot) => {
    rows.value = await selectTierData(snapshot)
  })
})
</script>

<style>
:root {
  --imgWidth: 139px;
  --imgHeight: 80px;
  --rowHeight: 80px;
}
.tierlist-wrapper {
  display: inline-block;
  text-align: left;
  margin: 0;
}
ul {
  list-style-type: none;
  justify-content: flex-start;
  min-height: 80px;
}
li {
  cursor: pointer;
  border: solid #ddd 1px;
}
.tier-row {
  display: flex;
  align-items: stretch;
  /* margin-bottom: 10px; */
}
.label-wrapper {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.label-input {
  width: 80px;
  height: auto;
  align-self: stretch;
  font-size: 18px;
  text-align: center;
  border: none;
  border-radius: 4px;
}
.color-picker {
  width: 30px;
  height: auto;
  align-self: stretch;
  margin-left: 5px;
  border: none;
  padding: 0;
}
/* .tier-row input {
  width: 80px;
  height: auto;
  align-self: stretch;
  margin-right: 10px;
  font-size: 18px;
  text-align: center;
} */
.tier-row ul {
  display: flex;
  padding: 0;
  margin: 0;
}
.ghost {
  opacity: 0.2;
  width: 200px;
}
.button-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
}
.button-group button {
  margin: 2px 0;
  padding: 2px 5px;
  height: calc(var(--rowHeight) / 3);
  font-size: 12px;
}
.tooltip {
  position: absolute;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  white-space: nowrap;
}
.items {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 1px;
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: flex-start;
}
.items li {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
.tier-row img {
  height: var(--imgHeight);
  width: auto;
  object-fit: cover;
  border-radius: 4px;
}
</style>
