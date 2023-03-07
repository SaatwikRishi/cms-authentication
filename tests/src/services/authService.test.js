// const { describe, it, expect, jest } = require('@jest/globals')
const authService = require('../../../src/services/authService')
const db = require('../../../src/database/models/index')
const { UniqueConstraintError } = require('sequelize')
const HttpError = require('../../../src/util/errors/httpError')
const jwtUtil = require('../../../src/util/jwtUtil')
const redisUtil = require('../../../src/util/redisUtil')
const passUtil = require('../../../src/util/passwordUtil')

describe('Tests for authService', () => {
  describe('Tests for Creating a user', () => {
    it('should create a user when the username and password is valid', async () => {
      jest.spyOn(db.user, 'create').mockResolvedValue({
        dataValues: {
          username: 'saatwik',
          password: '123456'
        }
      })
      const res = await authService.createUser('saatwik', '123456')
      expect(res.dataValues).toEqual({
        username: 'saatwik'
      })
    })
    it('should throw an error when the username is already taken', async () => {
      jest
        .spyOn(db.user, 'create')
        .mockRejectedValue(new UniqueConstraintError())
      try {
        const res = await authService.createUser('saatwik', '123456')
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError)
      }
    })
    it('should throw an error when there is some error in the database', async () => {
      jest.spyOn(db.user, 'create').mockRejectedValue(new Error())
      try {
        const res = await authService.createUser('saatwik', '123456')
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError)
      }
    })
  })
  describe('Tests for login', () => {
    it('should return the token when the username and password is correct', async () => {
      jest.spyOn(db.user, 'findOne').mockResolvedValue({
        dataValues: {
          username: 'saatwik'
        }
      })
      jest.spyOn(passUtil, 'verifyPassword').mockResolvedValue(true)
      jest.spyOn(jwtUtil, 'generateJWTToken').mockReturnValue('token')
      jest.spyOn(redisUtil, 'saveTokenInRedis').mockResolvedValue(true)
      const res = await authService.login('saatwik', '123456')
      expect(res).toEqual('token')
    })
    it('should throw an error when the user is not found', () => {
      jest.spyOn(db.user, 'findOne').mockResolvedValue(null)
      const res = authService.login('saatwik', '123456')
      expect(res).rejects.toBeInstanceOf(HttpError)
    })
    it('should throw an error when the password is incorrect', () => {
      jest.spyOn(db.user, 'findOne').mockResolvedValue({
        dataValues: {
          password: '123456'
        }
      })
      jest.spyOn(passUtil, 'verifyPassword').mockResolvedValue(false)
      const res = authService.login('saatwik', '123456')
      expect(res).rejects.toBeInstanceOf(HttpError)
    })
  })

  describe('Tests for validate token', () => {
    it('should return the token when the token is valid', async () => {
      jest.spyOn(redisUtil, 'verifyToken').mockResolvedValue('token')
      jest.spyOn(jwtUtil, 'verifyToken').mockResolvedValue('token')
      const res = await authService.validateToken('token')
      expect(res).toEqual('token')
    })
    it('should throw an error when the token is invalid', () => {
      jest.spyOn(redisUtil, 'verifyToken').mockRejectedValue(new Error())
      const res = authService.validateToken('token')
      expect(res).rejects.toBeInstanceOf(HttpError)
    })
  })
})
