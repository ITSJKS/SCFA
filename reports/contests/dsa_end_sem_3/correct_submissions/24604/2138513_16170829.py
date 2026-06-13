def findDifference(N, nums):
    sum_even=0
    sum_odd=0 
    for i in range(len(nums)):
        if nums[i]%2==0:
            sum_even+=nums[i]
        else:
            sum_odd+=nums[i]
    return sum_even-sum_odd