def findDifference(N, nums):
    # if N==1:
    #     return nums[0]
    even=0
    odd=0
    for i in range(len(nums)):
        if nums[i]%2==0:
            even+=nums[i]
        else:
            odd+=nums[i]
    return even-odd