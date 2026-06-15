def findDifference(N, nums):
    count_even=0
    count_odd=0
    for i in nums:
        if i%2==0:
            count_even+=i
        else:
            count_odd+=i
    return count_even-count_odd