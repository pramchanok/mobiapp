<template>
    <v-dialog v-model="model" max-width="400" persistent>
        <v-card class="rounded-xl elevation-10 pa-0">
            <v-card-title class="text-h6 text-center py-4 px-6">
                {{ title }}
            </v-card-title>

            <!-- <v-divider></v-divider> -->

            <v-card-text class="text-center text-medium-emphasis py-6 px-6">
                {{ message }}
            </v-card-text>

            <!-- <v-divider></v-divider> -->

            <v-card-actions class="justify-end py-3 px-4">
                <v-btn variant="tonal" color="primary" @click="confirm"
                    >ยืนยัน</v-btn
                >
                <v-btn variant="tonal" color="error" @click="cancel"
                    >ยกเลิก</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const props = defineProps({
    modelValue: Boolean,
    title: { type: String, default: "ยืนยันการทำรายการ" },
    message: { type: String, default: "คุณแน่ใจหรือไม่ที่จะดำเนินการนี้?" }
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const model = ref(props.modelValue);

watch(
    () => props.modelValue,
    (val) => (model.value = val)
);
watch(model, (val) => emit("update:modelValue", val));

function cancel() {
    model.value = false;
}
function confirm() {
    emit("confirm");
    model.value = false;
}
</script>

<style scoped lang="scss">
.v-card-title {
    font-weight: 600;
    color: #1867c0;
}
</style>
