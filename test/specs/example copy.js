describe('example test', function() {
    it('should run', async function() {
        await $('~Login').click()
        await $('~input-email').setValue('test@mail.com')
        await $('~input-password').setValue('12345678')

        await $('~You are logged in!').isDisplayed()
    })
})
