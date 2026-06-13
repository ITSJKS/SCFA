def findDifference(N, nums):
    odd=even=0
    for i in range(N):
        if nums[i]%2==0: even+=nums[i]
        else: odd+=nums[i]
    return even-odd