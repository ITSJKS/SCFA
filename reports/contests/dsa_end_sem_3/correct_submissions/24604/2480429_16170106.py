def findDifference(N, nums):
    res = 0
    for i in range(N):
        if nums[i]%2==0:
            res+=nums[i]
        else:
            res-=nums[i]
    return res