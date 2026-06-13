def findDifference(N, nums):
    e = 0
    o = 0
    for i in nums:
        if i%2:o+=i
        else: e+=i
    return e-o