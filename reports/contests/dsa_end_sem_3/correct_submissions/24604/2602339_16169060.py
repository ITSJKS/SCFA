def findDifference(N, nums):
    e=0
    o=0
    for i in nums:
        if i%2==0:
            e+=i
        else:
            o+=i

    return e-o