def findDifference(N, nums):
    d=0
    d1=0
    for i in range(len(nums)):
        if nums[i]%2==0:
            d1+=nums[i]
        else:
            d+=nums[i]
    return d1-d