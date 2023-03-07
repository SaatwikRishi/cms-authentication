// import { expect, it, jest, describe } from '@jest/globals'
const jwt = require('jsonwebtoken')
const { generateJWTToken, verifyToken } = require('../../../src/util/jwtUtil')
describe('Tests for JWT Util', () => {
  describe('GENERATE JWT TOKEN', () => {
    it('should generate a JWT Token', () => {
      jest.spyOn(jwt, 'sign').mockReturnValue('token')
      const token = generateJWTToken('saatwik')
      expect(token).toBe('token')
    })
  })
  describe('Verify JWT Token', () => {
    const validToken = generateJWTToken({ id: 1, username: 'saatwik' })
    it('should verify a JWT Token', () => {
      const token = verifyToken(validToken)
      expect(token).resolves.not.toBe(null)
    })
    it('should give out an error', () => {
      const token = verifyToken('invalidToken')
      expect(token).rejects.toBeInstanceOf(Error)
    })
    // test the verify token function
  })
})
