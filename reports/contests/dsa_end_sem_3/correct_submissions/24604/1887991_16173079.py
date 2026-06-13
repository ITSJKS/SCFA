def findDifference(N, nums):
    e=0
    o=0
    x=0
    for i in nums:
        if i %2==0:
            e+=i
        else:
            o+=i
    
    x= (e-o)

    return x