import coachService from '../../service/coach.service';
import { Role } from '../../types';

const validId = 1;
const invalidId = -1;
const validFirstName = 'Test';
const validLastName = 'Tester';
const validPassword = 'password';
const validEmail = 'testtester@ucll.be';
const validPhoneNumber = '0423456789';
const validRole = 'coach' as Role;

const validUser = {
    id: validId,
    firstName: validFirstName,
    lastName: validLastName,
    email: validEmail,
    phoneNumber: validPhoneNumber,
    role: validRole,
    password: validPassword
};

const validCoach = {
    id: validId,
    user: validUser
};

let mockGetAllCoaches: jest.Mock;
let mockGetCoachById: jest.Mock;
let mockCreateCoach: jest.Mock;

beforeEach(() => {
    mockGetAllCoaches = jest.fn();
    mockGetCoachById = jest.fn();
    mockCreateCoach = jest.fn();

    coachService.getAllCoaches = mockGetAllCoaches;
    coachService.getCoachById = mockGetCoachById;
    coachService.createCoach = mockCreateCoach;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given no coaches in the database, when getAllCoaches is called, then it should return an empty array', async () => {
    mockGetAllCoaches.mockResolvedValue([]);
    const coaches = await coachService.getAllCoaches();
    expect(coaches).toEqual([]);
    expect(mockGetAllCoaches).toHaveBeenCalledTimes(1);
});

test('given coaches in the database, when getAllCoaches is called, then it should return all coaches', async () => {
    mockGetAllCoaches.mockResolvedValue([validCoach]);
    const coaches = await coachService.getAllCoaches();
    expect(coaches).toEqual([validCoach]);
    expect(mockGetAllCoaches).toHaveBeenCalledTimes(1);
});

test('given a valid coach id, when getCoachById is called, then it should return the coach', async () => {
    mockGetCoachById.mockResolvedValue(validCoach);
    const coach = await coachService.getCoachById(validId);
    expect(coach).toEqual(validCoach);
    expect(mockGetCoachById).toHaveBeenCalledWith(validId);
});

test('given an invalid coach id, when getCoachById is called, then it should throw an error', async () => {
    mockGetCoachById.mockRejectedValue(new Error(`Coach with id ${invalidId} does not exist.`));
    await expect(coachService.getCoachById(invalidId)).rejects.toThrow(`Coach with id ${invalidId} does not exist.`);
    expect(mockGetCoachById).toHaveBeenCalledWith(invalidId);
});


test('given a new coach, when createCoach is called, then it should create and return the coach', async () => {
    mockCreateCoach.mockResolvedValue(validCoach);
    const coachInput = {
        user: validUser
    };
    const coach = await coachService.createCoach(coachInput);
    expect(coach).toMatchObject(coachInput);
    expect(mockCreateCoach).toHaveBeenCalledWith(coachInput);
});
