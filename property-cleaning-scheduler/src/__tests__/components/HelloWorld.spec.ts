import { describe, it, expect } from 'vitest'
import { mountWithContext } from '../utils/test-utils'
import HelloWorld from '@/components/dumb/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders message prop correctly', () => {
    const msg = 'Test Message'
    const wrapper = mountWithContext(HelloWorld, {
      props: { msg }
    })
    
    expect(wrapper.text()).toContain(msg)
    expect(wrapper.find('.hello-world').exists()).toBe(true)
  })
  
  it('contains a test button', () => {
    const wrapper = mountWithContext(HelloWorld, {
      props: { msg: 'Hello' }
    })
    
    const button = wrapper.find('.v-btn')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Test Button')
  })
}) 