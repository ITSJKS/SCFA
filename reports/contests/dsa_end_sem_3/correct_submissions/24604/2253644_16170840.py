def findDifference(N, nums):
    e=0
    o=0
    for i in range(len(nums)):
        if nums[i]%2==0:
            e+=nums[i]
    for j in range(len(nums)):
        if nums[j]%2!=0:
            o+=nums[j]
    return e-o