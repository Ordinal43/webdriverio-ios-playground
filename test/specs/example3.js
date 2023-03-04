describe('Third test', function() {
    it('This one should pass', async function() {
        await $('~Login').click()

        await expect($('~button-LOGIN')).toBeDisplayed()
    })

    it('This one should fail', async function() {
        await $('~Login').click()
        await $('~input-email').setValue('test@mail.com')
        await $('~input-password').setValue('12345678')

        await $('~button-LOGIN').click()

        await expect($('~Wrong!')).toBeDisplayed()
    })
})
