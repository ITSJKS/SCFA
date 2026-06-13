def findDifference(N, nums):
    o = 0
    e = 0
    for i in nums:
        if i%2:
            o+=i
        else:
            e+=i
    return e-o