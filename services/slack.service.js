const { IncomingWebhook } = require('@slack/webhook')

const failedAttachment = function(test, errorMessage, { duration }) {
    const failedMessage = {
        color: '#dc3545',
        author_name: `${test.title}`,
        footer: `Uh! Oh! FAILED - Duration: ${timeConverter(duration)}\n${test._retriedTest ? `This is a retried test and failed after ${test._currentRetry} retries` : ''}\n${errorMessage}`,
        footer_icon: 'https://www.pinclipart.com/picdir/big/31-316209_circle-x-clipart-reject-icon-png-download.png',
        ts: Date.now()
    }
    return failedMessage
}

const passedAttachment = function(test, { duration }) {
    const passedMessage = {
        color: '#6bc77c',
        author_name: `${test.title}`,
        footer: `Woo! Ooh! PASSED - Duration: ${timeConverter(duration)}\n${test._retriedTest ? `This is a retried test and passed after ${test._currentRetry} retries` : ''}`,
        footer_icon: 'https://vectorified.com/images/icon-pass-19.png'
    }
    return passedMessage
}

function timeConverter(duration) {
    const minutes = Math.floor(duration / 60000)
    const seconds = ((duration % 60000) / 1000).toFixed(0)
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

class SlackService {

    constructor(options) {
        this.options = options
        this.webhook = this.options.webHookUrl
            ? new IncomingWebhook(this.options.webHookUrl)
            : (function() {
                console.error('[slack-error]: Slack webhook URL is not defined')
                return
            })()
        this.failedTests = 0
        this.passedTests = 0
        this.tests = 0
        this.testNameFull = ''
        this.attachment = [{
            pretext: `*${this.options.messageTitle || 'Webdriverio Slack Reporter'}*`,
            title: '',
        }]
        this.testTitle = ''
    }

    beforeTest(test) {
        console.log('=============testobj=============')
        console.log(test)
        ++this.tests
        if (this.tests <= 1) this.testNameFull = test.parent
        this.testTitle = test.title
    }

    async afterTest(test, context, results) {
        console.log('=============testobj=============')
        console.log(test)
        console.log('=============resultsobj=============')
        console.log(results)
        if (test._currentRetry >= 0 && !results.passed) {
            --this.tests
            if(test._currentRetry === test._retries || test._retries === -1) {
                let testError = ''
                if ('matcherResult' in results.error)
                    testError = results.error.matcherResult.message.replace(/[\u001b\u009b][-[+()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
                else{
                    testError = results.error
                }

                ++this.failedTests
                ++this.tests
                const attach = failedAttachment(test, testError.toString(), results)
                this.attachment.push(attach)
                return
            }
            return
        }

        if (results.passed) {
            ++this.passedTests
            this.attachment.push(passedAttachment(test, results))
        }
    }

    async after() {
        this.attachment[0].title = `${this.testNameFull}`
        this.attachment[0].color = '#ffc107'
        this.attachment.push({author_name: `Total tests: ${this.tests} | Total passed: ${this.passedTests} | Total failed: ${this.failedTests}`, color: '#4366c7' })
        if (this.failedTests > 0 && this.options.notifyOnlyOnFailure === true) {
            await this.webhook.send({ attachments: this.attachment })
            return
        }
        if(!this.options.notifyOnlyOnFailure === true) {
            await this.webhook.send({ attachments: this.attachment })
        }
    }

}

module.exports = SlackService
