def findDifference(N, nums):
    even_sum=0
    odd_sum=0
    for i in range(N):
        if nums[i]%2==0:
            even_sum+=nums[i]
        else:
            odd_sum+=nums[i]
    diff= even_sum-odd_sum
    return diff