export const focusFirstInvalid = () => {
    setTimeout(() => {
        const el = document.querySelector(`
        .v-input.v-input--error input,
        .v-input.v-input--error textarea,
        .v-input.v-input--error .v-select__selection-text,
        .v-input.v-input--error .v-field__input
      `)

        if (el) {
            // ✅ Scroll ก่อน
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })

            // ✅ ค่อย focus หลัง scroll (หน่วงนิดเพื่อให้เนียน)
            setTimeout(() => {
                if (el.classList.contains('v-select__selection-text')) {
                    el.click()
                } else if (typeof el.focus === 'function') {
                    el.focus()
                }
            }, 300)
        }
    }, 0)
}
