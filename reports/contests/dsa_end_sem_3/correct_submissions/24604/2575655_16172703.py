def findDifference(N, nums):
    sum_odd=0
    sum_even=0

    for i in range(N):
        if nums[i]%2==0:
            sum_even+=nums[i]
        else:
            sum_odd+=nums[i]
    
    diff=sum_even-sum_odd

    return diff