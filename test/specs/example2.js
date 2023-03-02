describe('Second test', function() {
    it('This one should fail', async function() {
        await $('~Login').click()
        await $('~input-email').setValue('test@mail.com')
        await $('~input-password').setValue('12345678')

        await expect($('~Wrong!')).toBeDisplayed()
    })
})
