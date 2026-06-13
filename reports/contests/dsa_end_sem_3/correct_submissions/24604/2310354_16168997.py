def findDifference(N, nums):
    o=0
    e=0
    for i in nums:
        if i%2==0:
            e+=i
        else:
            o+=i
    return(e-o)