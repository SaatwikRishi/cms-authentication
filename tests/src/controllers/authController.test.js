// const { describe, it, expect, jest } = require('@jest/globals')
const authController = require('../../../src/controllers/authController')
const authService = require('../../../src/services/authService')
const HttpError = require('../../../src/util/errors/httpError')

describe('Tests for authController', () => {
  describe('Tests for create user', () => {
    const req = {
      body: {
        username: 'saatwik',
        password: 123456
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    it('should return the newly created user', async () => {
      jest
        .spyOn(authService, 'createUser')
        .mockResolvedValue({ username: 'saatwik' })
      await authController.createUser(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalled()
    })
    it('should throw an error when there is some error in the service', async () => {
      jest.spyOn(authService, 'createUser').mockRejectedValue(new Error())
      await authController.createUser(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalled()
    })
  })

  describe('Tests for login', () => {
    const req = {
      body: {
        username: 'saatwik',
        password: 123456
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    it('should return the token when the user is logged in', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue('token')
      await authController.login(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalled()
    })
    it('should throw an error when the service has some error internally', async () => {
      jest.spyOn(authService, 'login').mockRejectedValue(new Error())
      await authController.login(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalled()
    })
  })

  describe('Tests for validate token', () => {
    const req = {
      query: {
        token: 'token'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }

    it('should return the decoded token when the token is valid', async () => {
      jest.spyOn(authService, 'validateToken').mockResolvedValue('decoded')
      await authController.validateToken(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalled()
    })
    it('should throw an error when the token service has some error internally', async () => {
      jest.spyOn(authService, 'validateToken').mockRejectedValue(new Error())
      await authController.validateToken(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalled()
    })
    it('should throw an http error and send invalid message to the user when the token is invalid', async () => {
      jest
        .spyOn(authService, 'validateToken')
        .mockRejectedValue(new HttpError(401, 'invalid'))
      await authController.validateToken(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalled()
    })
  })
})
