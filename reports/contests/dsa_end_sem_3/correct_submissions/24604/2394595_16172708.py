def findDifference(N, nums):
    sum_ev=0
    sum_od=0
    for i in range(len(nums)):
        if nums[i]%2==0:
            sum_ev+=nums[i]
        elif nums[i]%2!=0:
            sum_od+=nums[i]
    diff =  sum_ev-sum_od
    return diff