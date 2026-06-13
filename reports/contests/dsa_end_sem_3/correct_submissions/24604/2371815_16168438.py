def findDifference(N, nums):
    eve=0
    odd=0
    for i in range(N):
        if(nums[i]%2==0):
            eve+=nums[i]
        else:
            odd+=nums[i]
    return eve-odd