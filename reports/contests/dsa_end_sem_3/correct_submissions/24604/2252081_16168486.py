def findDifference(N, nums):
    sum_even = 0
    sum_odd = 0
    for i in nums:
        if i%2==0:
            sum_even+=i
        else:
            sum_odd+=i
    return sum_even - sum_odd