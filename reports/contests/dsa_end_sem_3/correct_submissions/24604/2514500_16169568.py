def findDifference(N, nums):
    eSum=0
    oSum=0
    for i in nums:
        if(i%2==0):
            eSum+=i
        else:
            oSum+=i
    return eSum-oSum