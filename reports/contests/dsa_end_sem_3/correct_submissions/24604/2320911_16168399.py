def findDifference(N, nums):
    e, o = 0, 0
    for i in nums:
        if i%2 == 0:
            e += i
        else:
            o += i
    return e-o