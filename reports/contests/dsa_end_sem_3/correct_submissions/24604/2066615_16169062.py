def findDifference(N, nums):
    sume=0
    sumo=0
    for i in nums:
        if i%2==0:
            sume+=i
        else:
            sumo+=i
    return sume-sumo